import { searchOptions, youtubeValidateData } from './instances'
import YoutubeVideo from '../src/Structures/Youtube-Elements/video-element'
import YoutubeChannel from '../src/Structures/Youtube-Elements/channel-element'
import YoutubePlaylist from '../src/Structures/Youtube-Elements/playlist-element'

export class YoutubeApiLTE {
  constructor(searchOptions: searchOptions)
  public readonly searchOptions: searchOptions
  search(
    rawQuery: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    searchOptions?: searchOptions,
  ): Promise<YoutubeChannel[] | YoutubePlaylist[] | YoutubeVideo[]>
  searchOne(
    rawQuery: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    searchOptions?: searchOptions,
  ): Promise<YoutubeChannel | YoutubePlaylist | YoutubeVideo>
  safeSearch(
    rawQuery: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    searchOptions?: searchOptions,
  ): Promise<YoutubeChannel[] | YoutubePlaylist[] | YoutubeVideo[]>
  safeSearchOne(
    rawQuery: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    searchOptions?: searchOptions,
  ): Promise<YoutubeChannel | YoutubePlaylist | YoutubeVideo>
  isSafeCheck(
    rawUrl: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    searchOptions?: searchOptions,
  ): Promise<Boolean>
  getVideo(
    rawUrl: string | YoutubeVideo,
    searchOptions?: searchOptions,
    hardFetchMode?: Boolean,
  ): Promise<YoutubeVideo>
  getPlaylist(
    rawUrl: string | YoutubeVideo,
    searchOptions?: searchOptions,
    hardPlaylistfetchMode?: Boolean,
    hardVideofetchMode?: Boolean,
  ): Promise<YoutubePlaylist>
  validate(
    rawData: string | YoutubeChannel | YoutubePlaylist | YoutubeVideo,
    safeSearchMode?: Boolean,
  ): Promise<youtubeValidateData> | void
  getHomepage(searchOptions?: searchOptions): Promise<YoutubeVideo[]>
  getTrending(searchOptions?: searchOptions): Promise<YoutubeVideo[]>
  innerTubeApikey(searchOptions?: searchOptions): Promise<string | void>
}
