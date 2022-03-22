| gameSession Status           | reason                                                                                                                               | stream behavior                                |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| STREAM_DISCONNECTED          | Event is fired when user have no internet                                                                                            | stream pause + show disconnected popup         |
| EVENT_SERVER_OUT_OF_CAPACITY | Event is fired when the system exceeds the server capacity and the launch of the game is queued until required capacity is available | stream pause + show error capacity popup       |
| UNREACHABLE                  | Event is fired when the stream enters an unreachable or non recoverable state                                                        | stream pause + show must leave pop up          |
| EDGE_NODE_CRASHED            | Event is fired when the edge node has crashed and can not be recovered                                                               | stream pause + show must leave pop up          |
| EXPIRED                      | Event is fired when gameSession is already finished                                                                                  | stream pause + show must leave pop up          |
| REQUIRE_INTERACTION          | Event is fired when user are in battery saving mode                                                                                  | stream pause + show require interaction pop up |
| EVENT_STREAM_READY           | Event is fired when the stream video is ready and can be shown to the end user                                                       |
| VIDEO_CAN_PLAY               | Event is fired when the stream video is ready and can interact with the stream                                                       |
| EVENT_STREAM_PAUSED          | Event is fired when the stream is paused from client SDK or from the system level                                                    |
| EVENT_STREAM_RESUMED         | Event is fired when the stream is resumed from client SDK or from the system level                                                   |
| SHOW_END_SCREEN              | Event is fired when client received event from docker or game's time is up                                                           | show end screen                                |
| HAS_FINAL_SCORE              | Event is fired when client receive final result from docker                                                                          |
| EVENT_STREAM_TERMINATED      | Event is fired when the backend receives a signal for termination of the stream                                                      |
