
import AuthorityType from '../constants/AuthorityType';
import BaseModel from './BaseModel';
export default class User extends BaseModel {
    username: string;
    displayName: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    editPassword: string;
    authorities: Authority[];

    hasAuthorityType = (type:AuthorityType | AuthorityType[]) => {
        if (this.authorities)
        {
            for (let i = 0; i < this.authorities.length; i++) {
                const userAuthType = this.authorities[i];
                if (typeof type === 'string') {
                    if (userAuthType.name == type) {
                        return true;
                    }
                } else {
                    for (let t = 0; t < type.length; t++) {
                        const item = type[t];
                        if (item == userAuthType.name) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    birthDate: string;
    birthPlace: string;
    gender: 'MALE' | 'FEMALE' = 'MALE';

}

class Authority {
    name: AuthorityType;
}