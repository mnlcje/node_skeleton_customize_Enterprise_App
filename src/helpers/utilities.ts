import { Request, Response } from 'express';

export class Utilities {
    /*public static getCurrentUser(req: Request, res: Response): string {
        try {
            // if (Config.env === Environment.Dev || Config.env === Environment.Local) {
            return req.headers['user'] ? req.headers['user'] : 'gxk3690';
            // }
            // return req.headers['user'];
        } catch (e) {
            res.status(401).send('Unauthorized');
        }
    }*/

    public static milliSecToMinutesAndSeconds(milliSec: number) {
        let seconds: number = Math.floor(milliSec / 1000);
        let minutes: number = Math.floor(seconds / 60);
        let hour: number = Math.floor(minutes / 60);
        seconds = seconds % 60;
        minutes = minutes % 60;
        hour = hour % 24;
        return { hour: hour, minutes: minutes, seconds: seconds, total: (hour > 0) ? (hour + ':' + minutes + ':' + seconds) : (minutes + ':' + seconds) };
    }
}
