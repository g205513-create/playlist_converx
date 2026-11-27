#  Playlist Converx 

Aplicação web local desenvolvida com **Node.js** para baixar e converter playlists inteiras do YouTube para arquivos MP3, compactando todas as faixas automaticamente em um único arquivo `.zip` direto pelo navegador.

##  Funcionalidades

- **Download em lote:** Baixa todas as músicas disponíveis de uma playlist separadamente a partir de um único link.
- **Conversão automática:** Extrai o áudio original e converte para MP3 de alta qualidade (192kbps) via FFmpeg.
- **Tolera falhas:** Ignora vídeos privados, removidos ou bloqueados na playlist (`--ignore-errors`) sem interromper o processo.
- **Compactação em `.zip`:** Empacota todas as faixas numeradas (`01 - Título.mp3`) e realiza a limpeza automática dos arquivos temporários no servidor após o download.
- **Interface limpa:** Frontend simples e direto para colar o link e iniciar a conversão instantaneamente.

##  Tecnologias Utilizadas

- **Backend:** Node.js, Express, Archiver, Child Process (`spawn`)
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API / Blob)
- **Ferramentas de Sistema:** `yt-dlp` e `FFmpeg`

##  Estrutura do Projeto

```text
playlist_converx/
├── public/
│   └── index.html       # Interface web para colar o link e baixar o ZIP
├── server.js            # Servidor Express + execução do yt-dlp e Archiver
├── package.json         # Dependências e metadados do projeto
└── .gitignore           # Ignora node_modules e pastas temporárias

## Como executar

1. Antes de rodar o projeto, certifique-se de ter o Node.js, o yt-dlp e o FFmpeg instalados no sistema:
# Instalar yt-dlp e FFmpeg via winget
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg

2. Executar localmente:
clone os repositorios no powershell
git clone [https://github.com/g205513-create/playlist_converx.git](https://github.com/g205513-create/playlist_converx.git)
cd playlist_converx

3. Instale as dependências do node:
npm install

4. Inicie o servidor:
node server.js

5. E por fim abra o servidor "http://localhost:3000", e cole o link da playlist
```


## Autor

Feito por **Gabriel Silva** como projeto de melhoria de um processo demorado.
