// import { NotFoundResponse } from '../../utils/http-exceptions';
import { NotFoundResponse } from '../../lib/decorators';
// import { NotFoundResponse } from "http-errors-response-ts/lib";

class AuthService {
    // @ts-ignore
    getUser(req, res) {
        const user = "SSS"
        if (user)
            throw new NotFoundResponse("User not found")
            // return user;
    }

}

export default new AuthService();