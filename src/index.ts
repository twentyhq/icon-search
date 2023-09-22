import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3002;

interface Icon {
    name: string;
    category: string;
    tags: string[];
    version: string;
    unicode: string;
}

interface IconsMap {
    [key: string]: Icon;
}

const iconsData: IconsMap = JSON.parse(fs.readFileSync(path.join(__dirname, './../node_modules/@tabler/icons/tags.json'), 'utf-8'));

app.get('/search/:query', (req: Request, res: Response) => {
  const query = req.params.query.toLowerCase();
  
  const results: Icon[] = Object.values(iconsData).filter((icon: Icon) => {
    return icon.name.includes(query) || icon.tags.some(tag => tag.includes(query));
});
  res.json(results);
});


app.get('/fetch/:icon.svg', (req: Request, res: Response) => {
    const iconName = req.params.icon;

    const svgPath = path.join(__dirname, '../node_modules/@tabler/icons/icons', `${iconName}.svg`);

    if (fs.existsSync(svgPath)) {
        // File exists, read and send it
        const svgContent = fs.readFileSync(svgPath, 'utf-8');
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgContent);
    } else {
        // File does not exist, send a 404 status
        res.status(404).send('Icon not found');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
