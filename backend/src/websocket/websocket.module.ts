import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketGateway } from './websocket.gateway';
import { WsJwtGuard } from './ws-jwt.guard';

@Global()
@Module({
  imports: [JwtModule],
  providers: [WebsocketGateway, WsJwtGuard],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
