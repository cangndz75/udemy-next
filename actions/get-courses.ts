import { prismadb } from "@/lib/db";
import { Category, Course } from "@prisma/client";



type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: {id:string}[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId: string;
}

export const getCourses = async ({ userId, title, categoryId }: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await prismadb.course.findMany({
            where:{
                isPublished: true,
                title: title ? { contains: title } : undefined,
                categoryId: categoryId || undefined,
            },
            include:{
                category: true,
                chapters:{
                    where:{
                        isPublished:true
                    },  
                    select:{
                        id:true
                    },
                },
                purchases:{
                    where:{
                        userId
                    }
                }
            },
            orderBy:{
                createdAt:"desc"
            }
        });

        const coursesWithProgress = await Promise.all(courses.map(async course => {
            const publishedChaptersIds = course.chapters.map(chapter => chapter.id);

            const validCompletedChapters = await prismadb.userProgress.findMany({
                where: {
                    userId: userId,
                    chapterId: {
                        in: publishedChaptersIds
                    }
                },
                select: {
                    chapterId: true
                }
            });

            const progressPercent = publishedChaptersIds.length === 0 
                ? 0 
                : (validCompletedChapters.length / publishedChaptersIds.length) * 100;

            return {
                ...course,
                progress: isNaN(progressPercent) ? 0 : progressPercent,
            };
        }));

        return coursesWithProgress;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
}
