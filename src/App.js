import logo from './logo.svg';
import './App.css';
import * as React from "react";
//import { RouteComponentProps } from "react-router-dom";
//  "streaming-view-sdk": "git+https://appland-node@bitbucket.org/appland/streaming-view-sdk.git#20211116-2"

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import queryString from 'query-string';

import { StreamingView } from 'streaming-view-sdk';
import { StreamingController } from "streaming-view-sdk";

//let edgeNodeId = '';
const apiEndpoint= 'https://streaming-api-dev.appland-stream.com';
//let  userId='6fb34831-29ff-4d8c-8864-d2c0a41a26a5';
//https://streaming-api-dev.appland-stream.com/api/streaming-games/status/25470438-4686-423e-8709-0932949f9898?wait=1

function App() {
   const search = window.location.search;
   const params = new URLSearchParams(search);
   const edgeNodeId = params.get('edgeNodeId');
   const userId = params.get('userId');

 const startPlaying = async () => {
  console.log("startPlaying edgeNodeId -->"+edgeNodeId)
    const streamController = await StreamingController({
      apiEndpoint: apiEndpoint,
      edgeNodeId: edgeNodeId,
    });
    streamController.resume();
    /*if (gameSession?.id) {
      await startToRecordStreamVideo(gameSession?.id);
    }
    try {
      streamReadyCallback?.payload();
      streamRequireInteractionCallback?.payload();
    } catch (e) {
      console.error(`Fail to run call back functions`, e);
    }
    setConnectedTimes(new Date().getTime());
    */
  };

React.useEffect(()=>{

 // useEffect(() => {
     // handleQueryString();
      startPlaying()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });


/*function handleQueryString(key, value) {
        console.log('handleQueryString click');
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const foo = params.get('query');
        console.log("params -->"+params)
       // console.log("before edgeNodeId -->"+edgeNodeId)
       edgeNodeId =params.get('edgeNodeId')
      //setEdgeNodeId(params.get('edgeNodeId'))
  }*/


  return (
    <div className="App">
      <header className="App-header">
            <StreamingView
//            apiEndpoint={'https://streaming-api-dev.appland-stream.com/api/streaming-service/'}
               apiEndpoint={apiEndpoint} //https://streaming-api-dev.appland-stream.com
               edgeNodeId={edgeNodeId}
               //8671fbb5-7516-470c-a1d3-df8ada794a54
                userId={userId} // dev.onmo srini
      //         userId={'f1a74d03-b37a-47b6-b260-7daaa79df6b0'} // dev.onmo. --sheesha
//                 userId={'103a1b80-4c4b-4585-8658-398f82e8a6d8'}// play.onmo. --sheesha
      //         key={'5657ad69-7557-477e-899a-83b84f464d37'}
                 enableDebug={true}
                 enableControl={true}
                 enableFullScreen={false}
                >
                </StreamingView>
      </header>
    </div>
  );

}

export default App;
