import React, { useRef, useEffect, Component, ChangeEvent, FormEvent } from 'react';
import * as monaco from 'monaco-editor';
import { RefObject } from 'react';
console.log("global.self.MonacoEnvironment");

interface EditorProps 
{
	language:string 
	width:string, 
	height:string,
	theme:string,
	className?:string,
	content?:string
}

export default class CustomTextEditor extends Component<EditorProps, any>
{
	divEl:RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
	editor: monaco.editor.IStandaloneCodeEditor;

	theme:string;
	language:string;
	value:string;

	constructor(props:EditorProps)
	{
		super(props);
		this.language = props.language;
		this.theme    = props.theme;
		this.value    = props.content ? props.content : "";//['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n');
	}
	componentDidMount()
	{
		this.init();
	}
	componentDidUpdate()
	{
		let shouldReinit: boolean = false;
		if (this.props.language != this.language)
		{
			this.language = this.props.language;
			shouldReinit = true;
		}
		if (this.props.theme != this.theme)
		{
			this.theme = this.props.theme;
			shouldReinit = true;
		}

		if (shouldReinit)
		{
			this.value = this.editor.getValue();
			this.init();
		}
	}
	init()
	{
		if (this.divEl.current) {
			if (this.editor)
			{
				this.editor.dispose();
			}
			this.editor = monaco.editor.create(this.divEl.current, {
				value: this.value,
				language: this.props.language,
				theme: this.props.theme,
				
			});
			 
		}
	}
	getValue = () => {
		if (!this.editor)
		{
			return "";
		}
		return this.editor.getValue();
	}
	componentWillUnmount()
	{
		if (this.editor)
		{
			this.editor.dispose();
		}
	}
	 
	render(): React.ReactNode {
		const props = this.props;
		return (
		 	<div
			 	className={props.className} 
				style={{height:props.height, width:props.width}}  
				ref={this.divEl}></div>
		)
	}
}
// export const Editor: React.FC<EditorProps> = (props:EditorProps) => {
// 	const divEl = useRef<HTMLDivElement>(null);
// 	let editor: monaco.editor.IStandaloneCodeEditor;
// 	useEffect(() => {
// 		console.log("USE EFFECT");
// 		if (divEl.current) {
// 			editor = monaco.editor.create(divEl.current, {
// 				value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
// 				language: props.language,
// 				theme: props.theme
// 			});
// 		}
// 		return () => {
// 			editor.dispose();
// 		};
// 	}, []);
// 	return <div className={props.className} style={{height:props.height, width:props.width}}  ref={divEl}></div>;
// };
