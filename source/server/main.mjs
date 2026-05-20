import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const app = {
   Host: '127.0.0.1',
   Port: 3000,
   Public_Dir: path.join( path.dirname( fileURLToPath( import.meta.url ) ), '..', 'client', 'public' ),
   Mime: {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
   },
   validate( q ) {
      const url = q.url == '/' ? 'index.html' : q.url.substring( 1 );
      return ( url == 'index.html' || url == 'styles.css' || url == 'scripts.js' ) ? url : '';
   },
   async send_response( s, filePath ) {
      try {
         const text = await readFile( filePath );

         s.writeHead( 200, { 'Content-Type': this.Mime[path.extname( filePath )] } );
         s.end( text, 'utf-8' );
      } catch ( err ) {
         switch ( err.code ) {
            case 'ENOENT': {
               s.writeHead( 404, { 'Content-Type': 'text/html' } );
               s.end( '<h1>404 Not Found</h1>', 'utf-8' );
               break;
            }
            default: {
               s.writeHead( 500 );
               s.end( 'Server Error on sending response: ' + err.code );
            }
         } // switch
      } // try
   }, // send
}; // app

const main = createServer( async ( q, s ) => {
   console.log( q.url );
   const filePath = app.validate( q );
   if ( !filePath ) {
      s.writeHead( 404 );
      s.end('Not Found');
      return;
   }
   await app.send_response( s, path.join( app.Public_Dir, filePath ) );
});

main.listen( app.Port, app.Host, ( ) => {
   console.log( 'Listen on http://' + app.Host + ':' + app.Port );
});

// GNU Affero General Public License v3.0 or later
// NO WARRANTY OF ANY KIND more details at <https://www.gnu.org/licenses/>
// SPDX-License-Identifier: AGPL-3.0-or-later
// app: `hello-web-world` Web Application Exemplar
// Ⓒ Copyright (C) 2026 Oleg'Ease'Kharchuk ᦒ
