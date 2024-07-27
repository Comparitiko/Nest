import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
	name: 'products',
})
export class Product {
	@ApiProperty({
		example: 'cbe7adbc-4f6b-4028-a44e-12df80ff8e49',
		description: 'Product ID',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'T-Shirt Teslo',
		description: 'Product title',
		uniqueItems: true,
	})
	@Column('text', {
		unique: true,
	})
	title: string;

	@ApiProperty({
		example: 0.99,
		description: 'Product price',
	})
	@Column('float', {
		default: 0,
	})
	price: number;

	@ApiProperty({
		example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		description: 'Product description',
	})
	@Column({
		type: 'text',
		nullable: true,
	})
	description: string;

	@ApiProperty({
		example: 't_shirt_teslo',
		description: 'Product Slug - for SEO',
		uniqueItems: true,
	})
	@Column({
		type: 'text',
		unique: true,
	})
	slug: string;

	@ApiProperty({
		example: 2,
		description: 'Product stock',
		default: 0,
	})
	@Column({
		type: 'int',
		default: 0,
	})
	stock: number;

	@ApiProperty({
		example: ['S', 'M', 'L'],
		description: 'Product sizes',
	})
	@Column('text', {
		array: true,
	})
	sizes: string[];

	@ApiProperty({
		example: 'shirts',
		description: 'Product gender',
	})
	@Column('text')
	gender: string;

	@ApiProperty({
		example: ['t-shirt', 'cat-shirt'],
		description: 'Product sizes',
		default: [],
	})
	@Column('text', {
		array: true,
		default: [],
	})
	tags: string[];

	@ApiProperty()
	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	images?: ProductImage[];

	@ManyToOne(() => User, (user) => user.products)
	user: User;

	@BeforeInsert()
	checkSlug() {
		if (!this.slug) {
			this.slug = this.title;
		}
		this.replaceSlug();
	}

	@BeforeUpdate()
	checkSlugUpdate() {
		this.replaceSlug();
	}

	/**
	 * Replaces the slug with a slug that is compatible with the database
	 */
	private replaceSlug() {
		this.slug = this.slug
			.toLowerCase()
			.replaceAll(' ', '_')
			.replaceAll('`', '')
			.replaceAll('?', '')
			.replaceAll('!', '')
			.replaceAll('¡', '')
			.replaceAll('¿', '')
			.replaceAll('/', '')
			.replaceAll('\\', '')
			.replaceAll('.', '')
			.replaceAll(',', '');
	}
}
