/**
 * Created by Alexander Sveshnikov on 29.11.16.
 */

export default class ItemModel {
    /** @type {string} */
    _id;
    /** @type {string} */
    catName;
    /** @type {string} */
    catUid;
    /** @type {string} */
    description;
    /** @type {boolean} */
    extDescr;
    /** @type {string} */
    imageUrl;
    /** @type {string} */
    guid;
    /** @type {string} */
    link;
    /** @type {string} */
    pubDate;
    /** @type {string} */
    sourceId;
    /** @type {string} */
    sourceName;
    /** @type {string} */
    sourceUrl;
    /** @type {string} */
    title;

    //служебные
    /** @type {boolean} */
    needUpdate;

    /** @type {string} */
    articleHtml;
}
