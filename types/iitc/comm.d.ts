export { };

declare global {

  namespace IITC {

    namespace comm {

      type DEFAULT_CHANNELS = "all" | "faction" | "alerts";
      interface ChannelDef {
        id: string; /** unique ID. default: "all", "faction", "alerts" */
        name: string; /** tab name */
        localBounds?: boolean; /** is channel messages depending on map bounds ? */
        inputPrompt: string; /** lead text of imput line */
        inputClass: string; /** css class for input line */
        request: (channel: "all" | "faction" | "alerts", getOlderMsgs: boolean, isRetry = false) => void; // requestChannel,
        render: () => void; // renderChannel,
        sendMessage: (channel: string, message: string) => void; /** function for send message to channel */
      }

      const channels: ChannelDef[];

      /**
       * List of transformations to be applied to the message data.
       * Each transformation function takes the full message data object and returns the transformed markup.
       * The default transformations aim to convert the message markup into an older, more straightforward format,
       * facilitating easier understanding and backward compatibility with plugins expecting the older message format.
       *
       * @example
       * // Adding a new transformation function to the array
       * // This new function adds a "new" prefix to the player's plain text if the player is from the RESISTANCE team
       * messageTransformFunctions.push((data) => {
       *   const markup = data.markup;
       *   if (markup.length > 2 && markup[0][0] === 'PLAYER' && markup[0][1].team === 'RESISTANCE') {
       *     markup[1][1].plain = 'new ' + markup[1][1].plain;
       *   }
       *   return markup;
       * });
       */
      const messageTransformFunctions: ((data: Intel.Plext) => Intel.MarkUp)[];

      /**
       * Template of portal link in comm.
       * @default '<a onclick="window.selectPortalByLatLng({{ lat }}, {{ lng }});return false" title="{{ title }}" href="{{ url }}" class="help">{{ portal_name }}</a>'
       */
      let portalTemplate: string;
      /**
       * Template for time cell.
       * @default '<td><time class="{{ class_names }}" title="{{ time_title }}" data-timestamp="{{ unixtime }}">{{ time }}</time></td>'
       */
      let timeCellTemplate: string;
      /**
       * Template for player's nickname cell.
       * @default '<td><span class="invisep">&lt;</span><mark class="{{ class_names }}">{{ nick }}</mark><span class="invisep">&gt;</span></td>';
       */
      let nickCellTemplate: string;
      /**
       * Template for chat message text cell.
       * @default '<td class="{{ class_names }}">{{ msg }}</td>';
       */
      let msgCellTemplate: string;
      /**
       * Template for message row, includes cells for time, player nickname and message text.
       * @default '<tr data-guid="{{ guid }}" class="{{ class_names }}">{{ time_cell }}{{ nick_cell }}{{ msg_cell }}</tr>';
      */
      let msgRowTemplate: string;
      /**
       * Template for message divider.
       * @default '<tr class="divider"><td><hr></td><td>{{ text }}</td><td><hr></td></tr>';
       */
      let dividerTemplate: string;


      /**
       * Posts a chat message to intel comm context.
       */
      function sendChatMessage(tab: Omit<DEFAULT_CHANNELS, "alerts">, msg: string);

      /**
       * Returns the coordinates for the message to be sent, default is the center of the map.
       */
      function getLatLngForSendingMessage(): L.LatLng;

      /**
       * Requests chat messages.
       *
       * @param getOlderMsgs to determine if older messages are being requested.
       * @param isRetry to indicate if this is a retry attempt.
       */
      function requestChannel(channel: DEFAULT_CHANNELS, getOlderMsgs: boolean, isRetry = false): void;

      /**
       * Renders intel chat.
       *
       * @param oldMsgsWereAdded if old messages were added in the current rendering.
       */
      function renderChannel(channel: DEFAULT_CHANNELS, oldMsgsWereAdded: boolean): void;


      /*      
      OTHERS:
        parseMsgData,
 
        // List of transformations
        portalNameTransformations,
 
        // Render primitive, may be override
        renderMsgRow,
        renderDivider,
        renderTimeCell,
        renderNickCell,
        renderMsgCell,
        renderMarkup,
        transformMessage,
        renderMarkupEntity,
        renderPlayer,
        renderFactionEnt,
        renderPortal,
        renderText,
        getChatPortalName,
      
        renderData,
        _channelsData,
        _genPostData,
        _updateOldNewHash,
        _writeDataToHash,}
          }
        */
    }
  }
}
