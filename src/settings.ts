let SettingValues:{
        
  
    uiSetting: {
      
        defaultTitle: string
    },
     
    hosts:{ 
        api: string,
      
    }
};
type SettingsType = typeof SettingValues;
 
export default class Settings {

    private static _setting:SettingsType|undefined = undefined;

    public static get App() : SettingsType
    {
        if (this._setting)
        {
            return this._setting;
        }
         
        return this._setting = (window as any).appSetting;
    }
    
}