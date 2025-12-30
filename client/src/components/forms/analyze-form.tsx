import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import useArticles from "../../hooks/use-articles";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/form/input";
import Button from "../ui/button";
import { CircleNotchIcon } from "@phosphor-icons/react";
import {
  type AnalyzeUrlData,
  AnalyzeUrlSchema,
} from "../../lib/schemas/analyze-url";
import { XIcon } from "@phosphor-icons/react";

interface FormProps {
  className?: string;
}

const AnalyzeArticleForm = ({ className = "" }: FormProps) => {
  const { analyzeArticle, isAnalyzing } = useArticles();
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<AnalyzeUrlData>({
    resolver: zodResolver(AnalyzeUrlSchema),
    defaultValues: { url: "" },
  });

  const onSubmit = async (data: AnalyzeUrlData) => {
    const slug = await analyzeArticle(data);

    if (slug) {
      navigate(`/article/${slug}`);
    } else {
      setOpenModal(true);
    }

    reset();
  };

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openModal]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-2 sm:flex-row sm:items-center ${className}`}
    >
      {openModal && (
        <>
          <div
            className={`fixed inset-0 transition-opacity duration-500 ease-in-out bg-fg-dark ${
              openModal ? "opacity-20 z-0" : "opacity-0 -z-10"
            }`}
          />
          <div className="fixed inset-0 flex h-screen w-full items-center justify-center z-50">
            <div className="bg-bg-light-secondary border-1 border-bg-primary rounded-md p-6 w-96 mx-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Unable to process article</span>
                <button
                  onClick={() => setOpenModal(false)}
                  className="hover:cursor-pointer"
                >
                  <XIcon className="size-6 fill-fg-dark" />
                </button>
              </div>
              <p className="pt-4">
                This could be due to access restrictions, content type, or
                technical issues. Please try another URL. We have marked this
                URL for review.
              </p>
            </div>
          </div>
        </>
      )}
      <Input
        {...register("url")}
        id="url"
        label="Research Today"
        type="text"
        placeholder="Paste in the article url here..."
        error={errors.url}
        className="sm:w-full lg:w-full xl:w-2/3 2xl:w-2/5"
      />

      <Button
        variant="primary"
        disabled={!dirtyFields.url}
        className="sm:mt-auto sm:w-1/2 lg:w-fit"
        type="submit"
      >
        {isAnalyzing ? (
          <CircleNotchIcon size={20} className="animate-spin mx-auto" />
        ) : (
          <span>Analyze</span>
        )}
      </Button>
    </form>
  );
};

export default AnalyzeArticleForm;
