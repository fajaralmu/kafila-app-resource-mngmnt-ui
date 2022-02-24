import React from 'react'
import { ViewTemplate } from '../../layout/ViewTemplate'
import { BasePage } from '../BasePage'

import './Home.css'
import { invokeLater } from './../../utils/eventUtil';
import BaseState from '../../models/BaseState';
import BaseProps from '../../models/BaseProps';
import { commonWrapper } from '../../utils/commonWrapper';
import Settings from './../../settings';


class State extends BaseState {

    showTitle: boolean = false;
    welcomingWords: string[] = [];

}
class Home extends BasePage<BaseProps, State>
{
    state: State = new State();
    welcomingWord: string;

    constructor(props: any) {
        super(props);
        this.title = 
        this.welcomingWord = Settings.App.uiSetting.defaultTitle;
    }
    componentDidMount() {
        this.startDisplayWelcomingWord();
    }
    startDisplayWelcomingWord = () => {
        if (this.state.welcomingWords.join("") != this.welcomingWord) {
            invokeLater(() => {
                const words = this.state.welcomingWords;
                words.push(this.welcomingWord[this.welcomingWord.length - (this.welcomingWord.length - words.length)]);
                this.setState({ welcomingWords: words }, this.startDisplayWelcomingWord);
            }, 200);

        }
    }
    componentDidUpdate() {

    }

    render(): React.ReactNode {

        return (
            <ViewTemplate attributes={{ style: { textAlign: 'center', paddingTop: '30vh' } }}>
                <WelcomingWord word={this.state.welcomingWords.join("")} />
            </ViewTemplate>
        )
    }
}
const WelcomingWord = (props: { word: string }) => {

    return (
        <div
            style={{fontSize: '3em', fontWeight: 'bold'}} 
            className='text-primary text-center'>
                {props.word}
        </div>
    )
}

export default commonWrapper(Home);

// const Icon = () => {
//     return (
//         <svg className='mb-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="200" height="200">

//             <circle className='iconStroke strokeDark' fill="none" strokeWidth={190} cx="237" cy="310" r="95" />
//             <circle className='iconStroke strokeOrange' fill="none" strokeWidth={30} cx="237" cy="310" r="204.02205763103166" />
//             <circle className='iconStroke strokeOrange' fill="none" strokeWidth={150} cx="362" cy="310" r="75" />
//             {/* <circle className="iconBg" style={{fill:this.state.orangeBgColor}} strokeWidth={80} cx="362" cy="310" r="120"  /> */}
//             <circle className='iconStroke strokeDark' fill="none" strokeWidth={80} cx="362" cy="310" r="187.3846311734236" />

//         </svg>
//     );
// }