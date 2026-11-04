# Configuração dos servidores MCP

Dois servidores com papéis diferentes:

| Servidor | Tipo | Para que serve | Precisa de chave? |
| --- | --- | --- | --- |
| `pluggy` | Streamable HTTP (remoto) | Consultar a documentação da Pluggy: conceitos (Item, conta, transação) e endpoints | Não |
| `plaid` | STDIO (local, via `uvx`) | Criar um Item de teste na Plaid Sandbox e obter um `access_token` | Sim: Client ID e secret **de Sandbox** |

> Os valores `COLE_SEU_CLIENT_ID` e `COLE_SEU_SANDBOX_SECRET` abaixo são espaços reservados. Nunca faça commit de chaves reais nem as mostre em prints.

---

## 1. Pluggy Docs MCP (sem chave)

### No Codex (interface)

1. Configurações › Plug-ins › MCPs › Adicionar (em algumas versões: *MCP servers › Add server*).
2. **Troque o tipo para Streamable HTTP / HTTP com streaming** antes de preencher. Os campos Comando, Argumentos e Variáveis pertencem ao modo STDIO.
3. Nome: `pluggy`. URL: `https://mcp.pluggy.ai/mcp`. Autenticação, token e cabeçalhos ficam vazios.
4. Salve, feche o aplicativo e abra de novo. Inicie uma **conversa nova** e digite `/mcp`.

### No Claude Code (como neste repositório)

O arquivo [`.mcp.json`](../.mcp.json) na raiz já registra o servidor no escopo do projeto:

```json
{
  "mcpServers": {
    "pluggy": { "type": "http", "url": "https://mcp.pluggy.ai/mcp" }
  }
}
```

Ao abrir a pasta, o Claude Code pede aprovação para usar o servidor. Pelo terminal, o comando equivalente é:

```bash
claude mcp add --transport http --scope project pluggy https://mcp.pluggy.ai/mcp
```

### Como saber se funcionou

Estar habilitado nas configurações não prova nada. Rode o prompt **P01** de [prompts.md](prompts.md): deve aparecer uma chamada de ferramenta e uma lista de endpoints, incluindo `GET /v2/transactions`. O grupo se chama **Transaction**, no singular. Filtrar por "Transactions" retorna zero.

---

## 2. Plaid Sandbox MCP (com chaves de Sandbox)

### 2.1 Chaves

Em <https://dashboard.plaid.com>, abra **Developers › Keys** e copie o **Client ID** e o **Secret da seção Sandbox**. As credenciais da Pluggy não funcionam na Plaid, e as da Plaid não funcionam na Pluggy.

### 2.2 Instalar o `uv`

**Windows (PowerShell):**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
# feche e reabra o terminal
uv --version
(Get-Command uvx).Source      # ex.: C:\Users\<voce>\.local\bin\uvx.exe
```

**macOS / Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh    # ou: brew install uv
uv --version
command -v uvx                                      # ex.: /Users/<voce>/.local/bin/uvx
```

Guarde o **caminho absoluto** do `uvx`. É ele que vai no campo Comando.

> **Problema encontrado no Windows:** `uvx mcp-server-plaid` falhou ao montar o `plaid-python` (não há versão pré-montada no PyPI), com o erro `[WinError 2] ... build\bdist.win-amd64\wheel\plaid\model\...`. A causa é o caminho longo demais dentro do cache do `uv`. A solução foi montar uma vez com um cache de caminho curto e instalar o servidor como ferramenta:
>
> ```powershell
> $env:UV_CACHE_DIR = "C:\uvc"
> uv tool install mcp-server-plaid
> ```
>
> Isso cria `C:\Users\<voce>\.local\bin\mcp-server-plaid.exe`. Use esse caminho no campo Comando e deixe Argumentos **vazio**. As variáveis `PLAID_CLIENT_ID` e `PLAID_SECRET` continuam iguais.

### 2.3 No Codex (interface)

| Campo | Valor |
| --- | --- |
| Nome | `plaid` |
| Tipo | STDIO |
| Comando | caminho absoluto do `uvx` |
| Argumentos | `mcp-server-plaid` (sem aspas) |
| Variável `PLAID_CLIENT_ID` | seu Client ID |
| Variável `PLAID_SECRET` | seu secret de **Sandbox** |
| Encaminhamento de variáveis / Diretório de trabalho | vazios |

### 2.4 Alternativa: `config.toml` do Codex

Arquivo: `~/.codex/config.toml` (no Windows, `C:\Users\<voce>\.codex\config.toml`). Faça backup antes e não crie uma segunda seção `plaid`.

```toml
[mcp_servers.plaid]
command = "C:\\Users\\<voce>\\.local\\bin\\uvx.exe"   # no Mac: "/Users/<voce>/.local/bin/uvx"
args = ["mcp-server-plaid"]
startup_timeout_sec = 60

[mcp_servers.plaid.env]
PLAID_CLIENT_ID = "COLE_SEU_CLIENT_ID"
PLAID_SECRET = "COLE_SEU_SANDBOX_SECRET"
```

O arquivo fica **fora** deste repositório, e o `.gitignore` também ignora `config.toml` por precaução.

### 2.5 Alternativa: Claude Code

Este repositório já declara a Plaid em [`.mcp.json`](../.mcp.json), mas **sem as chaves**. O arquivo só referencia variáveis de ambiente:

```json
"plaid": {
  "type": "stdio",
  "command": "C:\\Users\\<voce>\\.local\\bin\\mcp-server-plaid.exe",
  "args": [],
  "env": {
    "PLAID_CLIENT_ID": "${PLAID_CLIENT_ID}",
    "PLAID_SECRET": "${PLAID_SECRET}"
  }
}
```

Os valores reais ficam nas variáveis de ambiente do **seu usuário do Windows**, fora do repositório. Rode no seu próprio PowerShell (não cole as chaves em nenhum chat):

```powershell
setx PLAID_CLIENT_ID "COLE_SEU_CLIENT_ID"
setx PLAID_SECRET "COLE_SEU_SANDBOX_SECRET"
```

Depois **feche o VS Code por completo e abra de novo**, para ele carregar as variáveis. No macOS/Linux, use `export` no `~/.zshrc` ou `~/.bashrc`.

Pelo terminal, a alternativa sem `.mcp.json` é registrar no escopo local:

```bash
claude mcp add plaid --scope local -e PLAID_CLIENT_ID=... -e PLAID_SECRET=... -- uvx mcp-server-plaid
```

### 2.6 Teste em etapas

1. `/mcp` lista `plaid`: a configuração foi reconhecida.
2. **P05** responde: a ferramenta carregou.
3. **P06** cria o Item: as credenciais de Sandbox funcionam.
4. **P07** devolve contas e transações: a leitura de dados funciona.

---

## Erros comuns (guia, p. 23)

| Sintoma | Como agir |
| --- | --- |
| Windows: `[WinError 2]` ao montar `plaid-python` | Monte com `UV_CACHE_DIR=C:\uvc` e `uv tool install mcp-server-plaid` (ver seção 2.2) |
| `command not found: uv` | Instale o `uv`, reabra o terminal e teste de novo |
| O Codex não encontra o `uvx` | Use o caminho absoluto no campo Comando |
| Servidor habilitado, mas sem ferramentas | Salve, feche e reabra o app, depois abra uma conversa nova |
| Filtro "Transactions" sem endpoints | Use **Transaction**, no singular |
| Erro de TOML | Confira aspas, colchetes e se a seção `plaid` está duplicada (no Windows, use `\\` no caminho) |
| Erro de autenticação Plaid | Confira se o secret é o de **Sandbox** |
| `PRODUCT_NOT_READY` | Espere um pouco e tente de novo, no máximo 3 vezes, sem inventar dados |
| Falha de rede / endereço não resolvido | Libere o acesso de rede a `sandbox.plaid.com` no ambiente de execução |

Fontes: [Pluggy MCP](https://docs.pluggy.ai/pt/docs/developer-tools/mcp) · [Plaid MCP (ai-coding-toolkit)](https://github.com/plaid/ai-coding-toolkit/blob/main/sandbox/README.md) · [Instalação do uv](https://docs.astral.sh/uv/getting-started/installation/)
