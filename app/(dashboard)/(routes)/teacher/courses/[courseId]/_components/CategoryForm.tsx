"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Undo } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  categoryId: z.string().min(1),
});

interface DescriptionFormProps {
  initaldata: Course;
  courseId: string;
  options: { label: string; value: string }[];
}
const CategoryForm = ({
  courseId,
  initaldata,
  options,
}: DescriptionFormProps) => {
  //useForm hookunu kullanarak formu oluşturuyoruz ve formun şemasını belirtiyoruz ve
  //defaultValues ile formun başlangıç değerlerini belirliyoruz
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initaldata?.categoryId || "",
    },
  });
  //formun durumunu alıyoruz ve isSubmitting ve isValid değişkenlerini alıyoruz
  //böylece formun durumuna göre butonları aktif veya pasif yapabiliriz
  const { isSubmitting, isValid } = form.formState;
  //useRouter hookunu kullanarak router nesnesini alıyoruz ve isEditing adında bir state tanımlıyoruz
  //çünkü düzenleme yapılıp yapılmadığını kontrol etmemiz gerekiyor
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  //toogleEditing adında bir fonksiyon tanımlıyoruz ve bu fonksiyon sayesinde düzenleme yapılıp yapılmadığını kontrol ediyoruz
  const toogleEditing = () => {
    //açık olanı kapatır kapalı olanı açar
    setIsEditing((current) => !current);
  };
  //formun gönderildiğinde çalışacak fonksiyon ve bu fonksiyon sayesinde formu gönderiyoruz
  //ve values adında bir parametre alıyor ve bu parametre formun değerlerini alır çünkü
  //z.infer ile formun şemasını alıyoruz ve bu sayede formun değerlerini alıyoruz
  //typeof şu şekilde kullanılır z.infer<typeof formSchema> ve formSchema zod objesidir ve bu objenin tipini almak için typeof kullanılır
  //bunun anlamı formSchema objesinin tipini al ve bu tipi z.infer fonksiyonuna ver
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast({
        title: "Course updated",
        variant: "success",
      });
      //düzenleme yapmayı kapatır
      toogleEditing();
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.message || "Error",
          variant: "destructive",
        });
      } else {
        toast({
          title: "An unknown error occurred",
          variant: "destructive",
        });
      }
    }
  };
  //selectedOption adında bir değişken tanımlıyoruz ve bu değişken sayesinde seçilen kategoriyi alıyoruz
  //find fonksiyonu ile options dizisindeki value değeri initaldata.categoryId değerine eşit olanı buluyoruz
  //option => option.value === initaldata.categoryId bu ifade ile options dizisindeki value değeri
  //initaldata.categoryId değerine eşit olanı buluyoruz
  //eğer bulursak bu değeri selectedOption değişkenine atıyoruz
  const selectedOption = options.find(
    (option) => option.value === initaldata.categoryId
  );
  return (
    <div className="mt-10 bg-slate-100 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Course Category </h1>
        <Button variant={"ghost"} onClick={toogleEditing}>
          {/* eğer düzenleme yapılıyorsa  */}
          {isEditing ? (
            <>
              <Undo className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="text-base mt-3">
          {selectedOption?.label || "No Category"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {/*//Combobox componentini kullanarak kategori seçme işlemi yapılır
                    //options propu ile kategorileri alır ve field propu ile formun değerlerini alır
                    //field kullanılma sebebi formun değerlerini almak ve formun durumunu almak için kullanılır
                    //ve Combobox componentine field propu ile formun değerlerini veririz*/}
                    <Combobox options={options} {...field}>

                    </Combobox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
