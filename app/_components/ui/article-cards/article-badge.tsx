import timeSince from "@/app/_lib/utils/timeSince";
import ClockIcon from "../../icons/clock";
import InfoIcon from "../../icons/info";

interface ArticleBadgeProps {
  variant: "time" | "bias";
  timeStamp?: string;
  bias?: string;
}
export default function ArticleBadge({
  variant,
  timeStamp,
  bias,
}: ArticleBadgeProps) {
  if (variant === "time") {
    if (timeStamp) {
      return (
        <div className="flex items-center gap-3 text-brand-500">
          <ClockIcon className="size-6" />
          <time className="text-lg" dateTime={timeStamp}>
            {timeSince(timeStamp)}
          </time>
        </div>
      );
    }
  } else if (variant === "bias") {
    return (
      <div className="flex items-center gap-1.5 bg-left-500 py-1 px-4 rounded-full">
        <span>{bias}</span>
        <InfoIcon className="size-3" />
      </div>
    );
  }
}
