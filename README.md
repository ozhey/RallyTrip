# Rally Trip

## Development mode
1. Go to `firebase.js` and make sure you're using the development config.\
If the project wasn't under development for a long time, it's possible that the dev firebase project is frozen and then you will have to log in to activate it.
2. Pay attention that there is no migration code. It's possible to copy the production's database but the image links will still point to the production's storage.
3. run `npm start` to start the project.
## Deployment

Generate a production build of the app, and deploy it to GitHub Pages.

``` 
npm run deploy 
```

## Making changes
### Adding a category
 This is controlled solely through the `link.js` file. To add a category just add another link.
### Removing a category
 This is controlled solely through the `link.js` file. This does not mean that if you remove one of the links, the products will dissapear - they will still be shown in the main products page. Thereforeת it's important to hide or delete all products from this category before removing the category's link. After removing the category's link, it will no longer be possible to edit the products from the UI.