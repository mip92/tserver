import { Field, ObjectType, Int, registerEnumType } from "@nestjs/graphql";
import { FileType } from "@prisma/client";

// Register Prisma enum as GraphQL enum
registerEnumType(FileType, {
  name: "FileType",
  description: "File type enum",
});

@ObjectType()
export class File {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  s3Key: string;

  @Field(() => String, { nullable: true })
  url?: string;

  @Field(() => FileType)
  type: FileType;

  @Field(() => Int)
  order: number;

  @Field(() => Int, { nullable: true })
  productId?: number;
}
