export enum HamsNearMeLocation {
  Front = "hamsnearme.front",
  About = "hamsnearme.about"
}
export enum StanceIndustriesLocation {
    Front = "stance-industries.front",
    About = "stance-industries.about"
}
type PageviewLocation = HamsNearMeLocation | StanceIndustriesLocation;
export interface PageviewParams {
  location: PageviewLocation;
}
export interface ClickParams {
    target: string;
}
interface CharcoalBaseProperties {
  referrer: string;
  url: string;
}
export type CharcoalEventProperties = (PageviewParams | ClickParams)
type CharcoalProperties = CharcoalBaseProperties & CharcoalEventProperties

const ENDPOINT = "https://chaitown.mosey.systems/track";

export const trackPageview = (params: PageviewParams) => track(params, "pageview");
export const trackClick = (params: ClickParams) => track(params, "click");

async function track(params: CharcoalEventProperties, name: string) {
  console.debug(`[charcoal] Got ${name} Params`, params);
    const properties: CharcoalProperties = {
        ...params,
        referrer: document.referrer,
        url: window.location.href
    };
    const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({ name, properties })
    });
    if (res.status === 200)
        console.debug(`[charcoal] ${name} sent.`);
    else
        console.error(`[charcoal] Failed to track ${name}.`);
}