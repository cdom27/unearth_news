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

interface FormProps {
  className?: string;
}

const AnalyzeArticleForm = ({ className = "" }: FormProps) => {
  const { analyzeArticle, isArticleLoading } = useArticles();
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
    }

    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-2 ${className}`}
    >
      <Input
        {...register("url")}
        id="url"
        label="Research Today"
        type="text"
        placeholder="Paste in the article url here..."
        error={errors.url}
      />

      <Button variant="primary" disabled={!dirtyFields.url}>
        {isArticleLoading ? (
          <CircleNotchIcon size={20} className="animate-spin mx-auto" />
        ) : (
          <span>Analyze</span>
        )}
      </Button>
    </form>
  );
};

export default AnalyzeArticleForm;
