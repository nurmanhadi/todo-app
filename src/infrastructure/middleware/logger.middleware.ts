import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const startTime = process.hrtime();

        res.on('finish', () => {
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const latency = (seconds * 1e9 + nanoseconds) / 1000;
            const timestamp = new Date().toISOString();

            const logEntry = {
                time: timestamp,
                remote_ip: req.ip,
                host: req.get('host'),
                method: req.method,
                uri: req.originalUrl,
                status: res.statusCode,
                error: res.statusCode >= 400 ? res.statusMessage : '',
                latency: latency,
                latency_human: `${latency}µs`,
                bytes_in: req.headers['content-length'] || 0,
                bytes_out: res.get('Content-Length') || 0,
            };

            console.log(JSON.stringify(logEntry));
        });
        next()
    }
}