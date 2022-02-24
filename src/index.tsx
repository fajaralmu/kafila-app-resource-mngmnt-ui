import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Provider } from 'inversify-react';
import { container } from './inversify.config';

// configure monaco editor
// @ts-ignore 
global.self.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId: any, label: string) {
		console.log("get worker function: ", _moduleId, label);
		if (label === 'json') {
			return './editorworkers/json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './editorworkers/css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './editorworkers/html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './editorworkers/ts.worker.bundle.js';
		}
		if (label === 'yaml' || label === 'yml')
		{
			return  './editorworkers/yaml.worker/js';
		}
		return './editorworkers/editor.worker.bundle.js';
	}
};

ReactDOM.render(
  <React.StrictMode>
    <Provider container={container} >
    <HashRouter>

      <App />
    </HashRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
