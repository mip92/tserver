import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ProductInput, ProductUpdateInput } from "./product.model";
import { ProductService } from "./product.service";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts() {
    const products = await this.productService.findAll();
    return { products };
  }

  @Get(":id")
  async getProductById(@Param("id") id: number) {
    const product = await this.productService.findById(id);
    return { product };
  }

  @Get("brand/:brandId")
  async getProductsByBrand(@Param("brandId") brandId: number) {
    const products = await this.productService.findByBrandId(brandId);
    return { products };
  }

  @Get("type/:type")
  async getProductsByType(@Param("type") type: string) {
    const products = await this.productService.findByType(type);
    return { products };
  }

  @Post()
  async createProduct(@Body() data: ProductInput) {
    const product = await this.productService.createProduct(data);
    return { product };
  }

  @Put(":id")
  async updateProduct(
    @Param("id") id: number,
    @Body() data: ProductUpdateInput
  ) {
    const product = await this.productService.updateProduct(id, data);
    return { product };
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: number) {
    const product = await this.productService.deleteProduct(id);
    return { product };
  }
}
