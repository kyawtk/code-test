import { z } from "zod";

// Backend schemas (copied from your route handler)
export const FacilityHighlightSchema = z.object({
  facilityName: z.string(),
  facilityId: z.number(),
});

export const FeatureGroupFeatureSchema = z.object({
  available: z.boolean(),
  featureName: z.string(),
});

export const FeatureGroupSchema = z.object({
  name: z.string(),
  id: z.number(),
  features: z.array(FeatureGroupFeatureSchema),
});

export const DescriptionSchema = z.object({
  short: z.string(),
});

export const ContentInformationSchema = z.object({
  description: DescriptionSchema,
});

export const ContentFeaturesSchema = z.object({
  facilityHighlights: z.array(FacilityHighlightSchema),
  featureGroups: z.array(FeatureGroupSchema),
});

export const ContentSummarySchema = z.object({
  displayName: z.string(),
});

export const ContentDetailSchema = z.object({
  contentSummary: ContentSummarySchema,
  contentInformation: ContentInformationSchema,
  contentFeatures: ContentFeaturesSchema,
});

export const PropertyDetailSchema = z.object({
  contentDetail: ContentDetailSchema,
});

export const PropertyDetailsSearchSchema = z.object({
  propertyDetails: z.array(PropertyDetailSchema),
});

export const HotelDataSchema = z.object({
  data: z.object({
    propertyDetailsSearch: PropertyDetailsSearchSchema,
  }),
});

export const ApiResponseSchema = z.object({
  name: z.string(),
  success: z.boolean(),
  hotelDescription: z.string(),
  facilityHighlights: z.array(FacilityHighlightSchema),
  featureGroups: z.array(FeatureGroupSchema),
});

export type ApiResponseBackend = z.infer<typeof ApiResponseSchema>;

export type HotelData = z.infer<typeof HotelDataSchema>;
