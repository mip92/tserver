import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class UploadResult {
  @Field()
  url: string;

  @Field()
  key: string;

  @Field()
  publicUrl: string;
}
