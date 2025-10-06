import { URL } from "url";

// normalize a news article URL to avoid duplicates caused by tracking params, etc.
export const normalizeUrl = (rawUrl: string): string => {
  const url = new URL(rawUrl);

  url.protocol = "https:";

  url.hostname = url.hostname.toLowerCase();

  // remove 'www.'
  if (url.hostname.startsWith("www.")) {
    url.hostname = url.hostname.substring(4);
  }

  const trackingParams = [
    // google analytics
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "gclid",
    "dclid",

    // social media
    "fbclid",
    "fb_action_ids",
    "fb_action_types",
    "fb_ref",
    "fbc",
    "fbid",
    "twclid",
    "tclid",
    "msclkid",
    "li_fat_id",

    // marketing/tracking
    "mc_cid",
    "mc_eid",
    "igshid",
    "vero_id",
    "oly_anon_id",
    "oly_enc_id",
    "mkt_tok",
    "hsa_acc",
    "hsa_cam",
    "hsa_grp",
    "hsa_ad",
    "hsa_net",
    "hsa_src",
    "hsa_tgt",
    "hsa_kw",
    "hsa_mt",
    "hsa_ver",

    // affiliate/referral
    "ref",
    "ref_src",
    "ref_url",
    "partner",
    "affiliate",
    "aff_id",
    "aff_source",
    "aff_sub",
    "aff_sub2",
    "aff_sub3",
    "aff_sub4",
    "aff_sub5",

    // general campaign junk
    "campaignid",
    "adgroupid",
    "adid",
    "creative",
    "keyword",
    "placement",
    "targetid",
    "src",
    "source",
  ];

  trackingParams.forEach((p) => url.searchParams.delete(p));

  const sortedParams = new URLSearchParams(
    [...url.searchParams.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  );
  url.search = sortedParams.toString();

  if (url.pathname.endsWith("/") && url.pathname !== "/") {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
};
