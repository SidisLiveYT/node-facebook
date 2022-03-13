<div align="center">
  <br />
  <p>
    <a href="https://github.com/SidisLiveYT/Jericho-Api"><img src="https://raw.githubusercontent.com/SidisLiveYT/Jericho-Api/master/.github/asserts/logo.svg" width="546" alt="jericho-api" /></a>
  </p>
  <br />
<p>
<a href="https://discord.gg/MfME24sJ2a"><img src="https://img.shields.io/discord/795434308005134406?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
<a href="https://www.npmjs.com/package/jericho-api"><img src="https://img.shields.io/npm/v/jericho-api.svg?maxAge=3600" alt="npm version" /></a>
<a href="https://www.npmjs.com/package/jericho-api"><img src="https://img.shields.io/npm/dt/jericho-api.svg?maxAge=3600" alt="npm downloads" /></a>
<a href="https://github.com/SidisLiveYT/Jericho-Api/actions"><img src="https://github.com/discordjs/discord.js/workflows/Testing/badge.svg" alt="Tests status" /></a>
</p>
</div>

Multi-Node-Api for Community Based Projects includes Custom-YoutubeApi and Many More Api's Wrappers and Many more will be included if you contact us and suggest us some great apis

## Installation

### Install **[jericho-api](https://npmjs.com/package/jericho-api)**

```sh
$ npm install --save jericho-api
```

# Features

- Soft and Hard fetch methods Integrated with YoutubeApiLTE Class
- Package can be used with Commonjs or ES6 Type of Javascript and typings included
- Added getHomepage() and getTrending() Function and returns Youtube Video Arrays
- Added <YoutubeVideo>.fetch() method for Hard Fetch Type
- Custom Youtube Wrapper and have many functions to fetch data
- Better Event Handlers and Request Handlers
- Better Body Parsing for Incomplete request ( HTTP Post Request )

### [Documentation](https://jericho-api.js.org/)
### Schemes :

#### Youtube Video Scheme :

```js
YoutubeVideo {
  Id: 1,
  videoId: '9UMxZofMNbA',
  title: 'Chillout Lounge - Calm & Relaxing Background Music | Study, Work, Sleep, Meditation, Chill',
  description: 'Short Description here [Edited for Scheme]',
  duration_raw: '00:00',
  duration: 0,
  url: 'https://www.youtube.com/watch?v=9UMxZofMNbA',
  uploadedAt: 'Started streaming on Jun 13, 2021',
  views: 12902240,
  thumbnail: YoutubeThumbnail {
    thumbnailId: '9UMxZofMNbA',
    width: 1920,
    height: 1080,
    url: 'https://i.ytimg.com/vi/9UMxZofMNbA/maxresdefault.jpg?v=60c5e7c1'
  },
  channel: YoutubeChannel {
    name: 'The Good Life Radio x Sensual Musique',
    verified: false,
    channelId: 'UChs0pSaEoNLV4mevBFGaoKA',
    icon: {
      url: 'https://yt3.ggpht.com/ytc/AKedOLRolK5uaMIsmYQV2cHzxxC8qSCH5aQ18O3_PMJHwQ=s48-c-k-c0x00ffffff-no-rj',
      width: 48,
      height: 48
    },
    subscribers: '674K',
    url: 'https://www.youtube.com/channel/UChs0pSaEoNLV4mevBFGaoKA'
  },
  likes: 109710,
  dislikes: 0,
  islive: true,
  isprivate: false,
  tags: [
    'chill-out music',
    'chill music',
    'chillout',
    'chill house',
    'chill',
    'out',
    'music',
    'deep house',
    'deep',
    'house',
    'house music',
    'dance music',
    'edm',
    'electronic dance music',
    'the good life radio',
    'the good life'
  ],
  suggestionVideos: [ ...YoutubeVideo[] ]
  // Here Recommendation Videos will be spotted But with soft fetch only | But you can fetch its total data by indivually -> <YoutubeVideo>.fetch() or fetch together by ->  <YoutubeApiLTE>.getVideo(Url , searchOptions , true) and it will return hard fetch videos
}
```

### Examples :

#### YoutubeApiLTE Class Example :

```js
const { YoutubeApiLTE } = require("jericho-api");

/**
 * searchOptions -> Search Options for <YoutubeApiLTE>.search() method
 *
 * (@) We are giving headers for "User-Agent" But you can also give other or left it as undefined or enable "randomUserAgents": true
 * (@) Search Options helps to filter the search results for Search Query URL and Axios get Response
 */
var searchOptions = {
  AxiosHttpRequestConfigs: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0",
    },
  },
};

/**
 * YoutubeInstance -> YoutubeInstance has been been created and all methods of Api calls will be used with it
 */

var YoutubeInstance = new YoutubeApiLTE(searchOptions);

/**
 * Youtube_Video -> Fetching Video Metadata from Search Result and also added <YoutubeVideo>.fetch() to get all exact Hard fetched Data ("You can ignore fetch if you are okay with search results or Soft Data")
 */
var Youtube_Video = new Promise(async (resolve) => {
  /**
   * <YoutubeApiLTE>.search() function has been called here to fetch Search Results Data
   *
   * (@) Added Default "searchOptions" But its choice based
   * (@) Added limit : 2 , To make only 2 Data or else you can give 1 and 0 for Infinty
   * (@) Added type : 'video' , Filter Parsing in <Axios>.get() Search Query URL | Choices -> "channel","playlist","video","all"
   */
  var Youtube_Video_Data = await YoutubeInstance.search(`Despacito`, {
    ...searchOptions,
    type: "all",
    limit: 2,
  });

  /**
   * Youtube_Video_Data -> Checking for its validity as a Data because Search Result will give usually you search for it in Youtube
   */
  if (!(Youtube_Video_Data?.[0] && Youtube_Video_Data?.[0]?.type === "video"))
    resolve(undefined);
  else {
    /**
     * <YoutubeVideo>.fetch()
     *
     * (@) Hard Fetching Data and parse it on same Instance to avoid buffer overflow and memory leaks
     * (@) if you encounter "429" Erros , you can use cookies and proxies or diffrent user-agent to fetch data through 'Axios'
     */
    await Youtube_Video_Data[0].fetch(searchOptions?.AxiosHttpRequestConfigs);
  }

  resolve(Youtube_Video_Data);
});

/**
 * Youtube_Video -> Fetched <YoutubeVideo> Class Instance
 */
console.log(Youtube_Video);
```

#### Cookies with YoutubeApiLTE :

```js
var searchOptions = {
  AxiosHttpRequestConfigs: {
    cookie:
      "xxxx=xyz-secret-youtube-cookie-browser-network-inspect-as-string-xxxx=xyznc",
  },
};

// OR

var searchOptions = {
  AxiosHttpRequestConfigs: {
    cookies:
      "xxxx=xyz-secret-youtube-cookie-browser-network-inspect-as-string-xxxx=xyznc",
  },
};
```

#### Proxy with YoutubeApiLTE :

```js
var searchOptions = {
  AxiosHttpRequestConfigs: {
    proxy: "https://www.goggle.com:456",
  },
};

// OR

var searchOptions = {
  AxiosHttpRequestConfigs: {
    proxy: { host: "www.google.com", port: 456 },
  },
};
```

#### User-Agents with YoutubeApiLTE :

```js
var searchOptions = {
  AxiosHttpRequestConfigs: {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; rv:78.0) Gecko/20100101 Firefox/78.0",
    },
  },
};
```

#### AxiosHTTPConfigs with YoutubeApiLTE :

```js
var searchOptions = {
  AxiosHttpRequestConfigs: {},
};
```

## Links

- [Source Code](https://github.com/SidisLiveYT/Jericho-Api.git)
- [GitHub Repo Link](https://github.com/SidisLiveYT/Jericho-Api)
- [NPM Package](https://www.npmjs.com/package/jericho-api)
- [Yarn Package](https://yarn.pm/jericho-api)
