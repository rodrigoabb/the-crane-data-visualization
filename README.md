# Welcome to theCrane APP!

**theCrane** is a Data Visualization App that allows you to understand trends in the community, by visualising relationships between Posts, Users and Topics in different ways.

This APP consumes directly from a GraphQL API (which we're not going to reference anywhere here in this project!).

The URL from where this GraphQL API is hosted can be set by:
- Go to `src/common/api`
- Create a file called 'config.ts' (at the same level of `apollo-client.ts`)
- Add the following:
```javascript
    const config = {
        API_URL: '{GRAPHQL_API_URL}',
    };

    export default config;
```

This will be use to instanciate an ApolloClient.

---

## Current Structure

At the moment, theCrane shows the following visualizations:

- Number of posts for each month over the analyzed period
- Number of posts by topic over the analyzed period
- TOP-3 topics for each month over the analyzed period
- TOP-3 topics for each user over the analyzed period


## What has been used?

theCrane App is using:

- [VX](https://github.com/airbnb/visx) for creating the Visualizations 
- [Apollo](https://www.apollographql.com/apollo-client) for GraphQL API communication
- [MomentJS](https://momentjs.com) for Date manipulation
- [TypeScript](https://www.typescriptlang.org)


## Things to do in the future

- Make app (and charts) responsive
- Add more visualizations
- Improving current visualizations components

---

## Regarding: Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
