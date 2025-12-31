from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.core.websocket import manager
from app.core import security
from app.core.config import settings
from jose import jwt, JWTError
from app.schemas.user import TokenPayload

router = APIRouter()

async def get_token_user_id(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
        return int(token_data.sub)
    except Exception:
        return None

@router.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    user_id = await get_token_user_id(token)
    if not user_id:
        await websocket.close(code=1008) # Policy Violation
        return

    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive, we don't expect messages from client for now
            data = await websocket.receive_text()
            # Echo or handle commands if needed
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
