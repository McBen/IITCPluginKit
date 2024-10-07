export { };

declare global {

  namespace IITC {

    /**
     * ### Filters API
     *
     * Filters API is a mechanism to hide intel entities using their properties (faction,
     * health, timestamp...). It provides two level APIs: a set of named filters that
     * apply globally (any entity matching one of the filters will be hidden), and low
     * level API to test an entity against a filter for generic purpose.
     * This comes with a Leaflet layer system following the old layer system, the filter
     * is disabled when the layer is added to the map and is enabled when removed.
     *
     * A filter applies to a combinaison of portal/link/field and is described by
     *  - data properties that must (all) match
     *  - or a predicate for complex filter
     *
     *   `{ portal: true, link: true, data: { team: 'E' }}`
     *       filters any ENL portal/link
     *
     *   `[{ link: true, data: { oGuid: "some guid" }}, { link: true, data: { dGuid: "some guid" }}]`
     *       filters any links on portal with guid "some guid"
     *
     *   `{ field: true, pred: function (f) { return f.options.timestamp < Date.parse('2021-10-31'); } }`
     *       filters any fields made before Halloween 2021
     *
     * Data properties can be specified as value, or as a complex expression (required
     * for array data properties). A complex expression is a 2-array, first element is
     * an operator, second is the argument of the operator for the property.
     * The operators are:
     *  - `['eq', value]` : this is equivalent to type directly `value`
     *  - `['not', ]`
     *  - `['or', [exp1, exp2,...]]`: the expression matches if one of the exp1.. matches
     *  - `['and', [exp1, exp2...]]`: matches if all exp1 matches (useful for array
     *   properties)
     *  - `['some', exp]`: when the property is an array, matches if one of the element
     *   matches `exp`
     *  - `['every', exp]`: all elements must match `exp`
     *  - `['<', number]`: for number comparison (and <= > >=)
     *
     * Examples:
     *
     *   `{ portal: true, data:  ['not', { history: { scoutControlled: false }, ornaments:
     *   ['some', 'sc5_p'] }] }`
     *       filters all portals but the one never scout controlled that have a scout
     *       volatile ornament
     *
     *   `{ portal: true, data: ['not', { resonators: ['every', { owner: 'some agent' } ] } ] }`
     *       filters all portals that have resonators not owned from 'some agent'
     *       (note: that would need to load portal details)
     *
     *   `{ portal: true, data: { level: ['or', [1,4,5]], health: ['>', 85] } }`
     *       filters all portals with level 1,4 or 5 and health over 85
     *
     *   `{ portal: true, link: true, field: true, options: { timestamp: ['<',
     *   Date.now() - 3600000] } }`
     *       filters all entities with no change since 1 hour (from the creation of
     *       the filter)
     */
    namespace filters {

      type Entity = IITC.Portal | IITC.Link | IITC.Field;
      type FilterTypes = "portal" | "link" | "field"

      interface FilterRule {
        portal?: boolean; /** is portal */
        link?: boolean; /** is link */
        field?: boolean; /** is field */

        pred?: (entity: Entity) => boolean; /** predicate on the entity */
        data?: FilterExpr;
        options?: FilterExpr;
      }

      type FilterExpr = {} | []; // TODO add more details

      /**
       * Sets or updates a filter with a given name. If a filter with the same name already exists, it is overwritten.
       * @see IITC.filters
       */
      function set(name: string, rules: FilterRule | FilterRule[]): void;

      /**
       * Checks if a filter with the specified name exists.
       *
       * @returns True if the filter exists
       */
      function has(name: string): boolean;

      /**
       * Removes a filter with the specified name.
       *
       * @returns True if the filter was successfully deleted
       */
      function remove(name: string): boolean;

      // internal
      /**
       * Tests whether a given entity matches a specified filter.
       * @returns true if the the `entity` of type `type` matches the `filter`
       */
      function testFilter(type: FilterTypes, entity: Entity, filter: FilterRule): boolean;

    }
  }
}


//  * Tests whether a given portal matches any of the currently active filters.
//  *
//  * @param {object} portal Portal to test
//  * @returns {boolean} `true` if the the portal matches one of the filters
//  */
// IITC.filters.filterPortal = function (portal) {
//   return arrayFilter('portal', portal, Object.values(IITC.filters._filters));
// };

// /**
//  * Tests whether a given link matches any of the currently active filters.
//  *
//  * @param {object} link Link to test
//  * @returns {boolean} `true` if the the link matches one of the filters
//  */
// IITC.filters.filterLink = function (link) {
//   return arrayFilter('link', link, Object.values(IITC.filters._filters));
// };

// /**
//  * Tests whether a given field matches any of the currently active filters.
//  *
//  * @param {object} field Field to test
//  * @returns {boolean} `true` if the the field matches one of the filters
//  */
// IITC.filters.filterField = function (field) {
//   return arrayFilter('field', field, Object.values(IITC.filters._filters));
// };

// /**
//  * Applies all existing filters to the entities (portals, links, and fields) on the map.
//  * Entities that match any of the active filters are removed from the map; others are added or remain on the map.
//  */
// IITC.filters.filterEntities = function () {
//   for (const guid in window.portals) {
//     const p = window.portals[guid];
//     if (IITC.filters.filterPortal(p)) p.remove();
//     else p.addTo(window.map);
//   }
//   for (const guid in window.links) {
//     const link = window.links[guid];
//     if (IITC.filters.filterLink(link)) link.remove();
//     else link.addTo(window.map);
//   }
//   for (const guid in window.fields) {
//     const field = window.fields[guid];
//     if (IITC.filters.filterField(field)) field.remove();
//     else field.addTo(window.map);
//   }
// };

// /**
//  * @memberof IITC.filters
//  * @class FilterLayer
//  * @description Layer abstraction to control with the layer chooser a filter.
//  *              The filter is disabled on layer add, and enabled on layer remove.
//  * @extends L.Layer
//  * @param {Object} options - Configuration options for the filter layer
//  * @param {string} options.name - The name of the filter
//  * @param {IITC.filters.FilterDesc} options.filter - The filter description
//  */
// IITC.filters.FilterLayer = L.Layer.extend({
//   options: {
//     name: null,
//     filter: {},
//   },

//   initialize: function (options) {
//     L.setOptions(this, options);
//     IITC.filters.set(this.options.name, this.options.filter);
//   },

//   onAdd: function () {
//     IITC.filters.remove(this.options.name);
//     IITC.filters.filterEntities();
//   },

//   onRemove: function () {
//     IITC.filters.set(this.options.name, this.options.filter);
//     IITC.filters.filterEntities();
//   },
// });
