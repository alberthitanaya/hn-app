# hn-app

react native hacker news reader

Features:

- Displays all the latest posts
- Simple string search on title on all posts
- Ability to open link in browser
- Runs on both iOS and Android
- Displays timestamps of comments and posts
- Share the link within the comments modal
- Comments and threads are displaced in hierarchical order

Future work:

- Save news. In order to do this I would've saved the post objects into AsyncStorage and fetch them in another tab.
- Pull to refresh. I would've implemented a refresher on the flatlist on dashboard to call the refetch in react query which would repopulate the list
- Tests. Add unit tests on some of the filtering functionality to verify functionality. e2e testing using detox for the post/comment loading.

Libraries used:

- react-query and axios for fetching was chosen as it is a widely used library and predictable to use. react-query provides very handy hooks for fetching, error and loading.
- react-navigation is pretty much the only navigation library on RN with wide spread support. Also using native navigation which provides better performance.
- react-native-elements provides all the basic components needed in most apps which all have props which can extend functionality.

Latest node LTS which I believe is 16.16 should work. yarn is also needed.

https://docs.expo.dev/get-started/installation/
Follow expo setup instructions to get expo cli installed on your machine. Install Expo Go from app store on your device if wanting to run on real device.

To install packages:
`yarn`

To run: `yarn start` to start metro bundler
