// geodesic
declare global {
    declare namespace L {

        interface GeodesicPolyline extends L.Polyline {
            getLatLngs(): L.LatLng[];
        }

        interface GeodesicPolygon extends GeodesicPolyline {
        }

        interface GeodesicCircle extends L.Polyline {
        }

        function GeodesicPolyline(): GeodesicPolyline;
        function GeodesicPolygon(): GeodesicPolygon;
        function GeodesicCircle(): GeodesicCircle;

        function geodesicPolyline(latlngs: L.LatLng[], options?: L.PolylineOptions): GeodesicPolyline;
        function geodesicPolygon(latlngs: L.LatLng[], options?: L.PolylineOptions): GeodesicPolygon;
    }
}