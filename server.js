const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/convert', (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl || (!targetUrl.includes('youtube.com') && !targetUrl.includes('youtu.be'))) {
        return res.status(400).send('Link inválido do YouTube.');
    }

    // Cria uma pasta temporária exclusiva para este download
    const jobId = Date.now().toString();
    const tempDir = path.join(__dirname, 'temp_' + jobId);
    fs.mkdirSync(tempDir, { recursive: true });

    console.log(`Iniciando download da playlist/vídeo em: ${tempDir}`);

    // Executa o yt-dlp para baixar todas as músicas da playlist
    const ytDlp = spawn('yt-dlp', [
        '-x',                                           // Extrair apenas áudio
        '--audio-format', 'mp3',                        // Converter para MP3
        '--audio-quality', '192K',                      // Qualidade 192kbps
        '--yes-playlist',                               // Forçar download da playlist inteira
        '--ignore-errors',                              // Pula vídeos privados/removidos sem travar
        '-o', path.join(tempDir, '%(playlist_index)02d - %(title)s.%(ext)s'),
        targetUrl
    ]);

    ytDlp.stderr.on('data', (data) => {
        console.log(`yt-dlp: ${data}`);
    });

    ytDlp.on('close', (code) => {
        // Verifica quais arquivos MP3 foram baixados
        const files = fs.readdirSync(tempDir).filter(f => f.endsWith('.mp3'));

        if (files.length === 0) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            return res.status(500).send('Nenhuma música pôde ser baixada. Verifique se a playlist é pública.');
        }

        // Define o download como um arquivo ZIP único
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', 'attachment; filename="playlist-youtube.zip"');

        const archive = archiver('zip', { zlib: { level: 5 } });

        // Quando terminar de enviar o ZIP, apaga a pasta temporária do servidor
        res.on('close', () => {
            fs.rmSync(tempDir, { recursive: true, force: true });
            console.log(`Download concluído e pasta temporária limpa.`);
        });

        archive.on('error', (err) => {
            console.error('Erro ao criar ZIP:', err);
            fs.rmSync(tempDir, { recursive: true, force: true });
        });

        // Conecta o ZIP direto no navegador do usuário e adiciona a pasta
        archive.pipe(res);
        archive.directory(tempDir, false);
        archive.finalize();
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});