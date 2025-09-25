import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SiteLayout from "../components/layouts/site-layout";
import {
  AnalyzeUrlSchema,
  type AnalyzeUrlData,
} from "../lib/schemas/analyze-url";

const LandingPage = () => {
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
    // do something
    console.log("user input:", data);
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
          Analyze
        </button>
      </form>
    </SiteLayout>
  );
};

export default LandingPage;
