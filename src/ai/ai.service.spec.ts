import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AiService', () => {
  let service: AiService;
  const fetchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = fetchMock as unknown as typeof fetch;

    const configService = {
      get: (key: string) => {
        if (key === 'ADK_GATEWAY_URL') {
          return 'https://gateway-actas-entrega-951100463087.us-east1.run.app';
        }
        if (key === 'ADK_GATEWAY_TIMEOUT_MS') {
          return '5000';
        }
        return undefined;
      },
    } as ConfigService;

    service = new AiService(configService, {} as PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call ADK gateway /api/chat and return response text', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          response: 'Hola, soy el agente ADK',
          session_id: 'session-1',
        }),
    });

    const reply = await service.detectIntentText('Hola', 'session-1');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://gateway-actas-entrega-951100463087.us-east1.run.app/api/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hola',
          session_id: 'session-1',
        }),
      }),
    );
    expect(reply).toBe('Hola, soy el agente ADK');
  });

  it('should return fallback message when gateway fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      text: () => Promise.resolve('AI agent unavailable'),
    });

    const reply = await service.detectIntentText('Hola', 'session-1');

    expect(reply).toContain('problemas para conectarme');
  });
});
