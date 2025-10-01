import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleNotchIcon } from "@phosphor-icons/react";
import SiteLayout from "../components/layouts/site-layout";
import useArticles from "../hooks/use-articles";
import {
  type AnalyzeUrlData,
  AnalyzeUrlSchema,
} from "../lib/schemas/analyze-url";
import { useNavigate } from "react-router";

const LandingPage = () => {
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
    <SiteLayout>
      <h1 className="text-4xl">Something something horseshoe</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 w-1/2 mt-10"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="url">Paste in the article below</label>
          <input
            {...register("url")}
            id="description"
            type="text"
            placeholder="https://source.com/..."
            className="bg-stone-100 border border-stone-300 p-2"
          />
          {errors.url && <span>{errors.url.message}</span>}
        </div>

        <button
          type="submit"
          disabled={!dirtyFields.url}
          className="bg-stone-800 text-stone-100 p-2 hover:cursor-pointer disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
        >
          {isArticleLoading ? (
            <CircleNotchIcon size={20} className="animate-spin mx-auto" />
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </form>
    </SiteLayout>
  );
};

export default LandingPage;
