
import AuthorityType from '../constants/AuthorityType';
import BaseModel from './BaseModel';
export default class User extends BaseModel {
    name: string;
    displayName: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    authorities: Authority[];

    hasAuthorityType = (type:AuthorityType) => {
        if (this.authorities)
        {
            for (let i = 0; i < this.authorities.length; i++) {
                const element = this.authorities[i];
                if (element.name == type) {
                    return true;
                }
            }
        }
        return false;
    }

}

class Authority {
    name: AuthorityType;
}