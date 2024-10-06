export { };

declare global {

  namespace IITC {

    namespace toolbox {

      interface ButtonOptions {
        id?: string;
        label: string;
        action: () => void;

        class?: string;  /** class(es) for the button */
        title?: string;  /** tooltip for the button */
        accessKey?: string;  /** access key for the button */
        mouseover?: (event: MouseEvent) => void;  /** mouseover event for the button */
        icon?: string;  /** Icon name from FontAwesome for the button */
      }

      type SortMethod = (a, b) => number;

      let buttons: Record<string, any>;
      let _defaultSortMethod: SortMethod;
      let sortMethod: SortMethod;

      /**
       * Adds a button to the toolbox.
       *
       * @returns {string|null} The ID of the added button or null if required parameters are missing.
       * 
       * @example
       * const buttonId = IITC.toolbox.addButton({
       *   label: 'AboutIITC',
       *   action: window.AboutIITC
       * });
       *
       * @example
       * const buttonId = IITC.toolbox.addButton({
       *   label: 'Test Button',
       *   action: () => alert('Clicked!')
       * });
       * 
       */
      function addButton(buttonOptions: ButtonOptions): string | undefined;

      /**
       * Updates an existing button in the toolbox.
       * @returns True if the button is successfully updated, false otherwise.
       * @example
       *  const isUpdated = IITC.toolbox.updateButton(buttonId, { label: 'Updated Button', action: () => console.log('New Action') });
       */
      function updateButton(buttonId: string, buttonOptions: Partial<ButtonOptions>): boolean;

      /**
       * Removes a button from the toolbox.
       *
       * @returns True if the button is successfully removed, false otherwise.
       * @example
       * const isRemoved = IITC.toolbox.removeButton(buttonId);
       */
      function removeButton(buttonId: string): boolean;

      /**
       * Sets the sorting method for the toolbox buttons.
       *
       * @example
       * IITC.toolbox.setSortMethod((a, b) => a.label.localeCompare(b.label));
       */
      function setSortMethod(compare: SortMethod): void;

    }
  }
}
