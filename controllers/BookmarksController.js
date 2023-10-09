import BookmarkModel from '../models/bookmark.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';

export default class BookmarksController extends Controller {
    constructor(HttpContext) {
        console.log("controlleur book");
        super(HttpContext, new Repository(new BookmarkModel()));
    }
}