import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({
	name: 'products',
})
export class Product {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text', {
		unique: true,
	})
	title: string;

	@Column('float', {
		default: 0,
	})
	price: number;

	@Column({
		type: 'text',
		nullable: true,
	})
	description: string;

	@Column({
		type: 'text',
		unique: true,
	})
	slug: string;

	@Column({
		type: 'int',
		default: 0,
	})
	stock: number;

	@Column('text', {
		array: true,
	})
	sizes: string[];

	@Column('text')
	gender: string;

	@Column('text', {
		array: true,
		default: [],
	})
	tags: string[];

	@OneToMany(() => ProductImage, (productImage) => productImage.product, {
		cascade: true,
		eager: true,
	})
	images?: ProductImage[];

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