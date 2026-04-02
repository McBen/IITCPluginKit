declare namespace L {
	export interface GridLayer {
		googleMutant(options: any): TileLayer;
	}

	export const gridLayer: GridLayer;
}