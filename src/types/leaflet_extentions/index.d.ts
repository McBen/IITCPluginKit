/* tslint:disable:no-namespace */
/* tslint:disable:no-empty-interface */

// geodesic
declare namespace L {
    interface GeodesicPolylineStatic extends PolylineStatic { }
    export const GeodesicPolyline: GeodesicPolylineStatic;
    export interface GeodesicPolyline extends Polyline {
        getLatLngs(): L.LatLng[];
    }

    interface GeodesicPolygonStatic extends PolygonStatic { }
    export const GeodesicPolygon: GeodesicPolygonStatic;
    export interface GeodesicPolygon extends GeodesicPolyline { }

    interface GeodesicCircleStatic extends PolylineStatic { }
    export const GeodesicCircle: GeodesicCircleStatic;
    export interface GeodesicCircle extends GeodesicPolyline { }

    function geodesicPolyline(latlngs: L.LatLng[], options: L.PolylineOptions): GeodesicPolyline;
    function geodesicPolygon(latlngs: L.LatLng[], options: L.PolylineOptions): GeodesicPolygon;


    export interface PolylineOptions {
        interactive?: boolean;
    }
    export interface MarkerOptions {
        interactive?: boolean;
    }
}
