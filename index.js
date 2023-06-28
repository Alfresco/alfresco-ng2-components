const fs = require('fs');

            const affectedLib = 'process';
            const fileName = 'text.txt';

            const content = read(fileName)
            console.log('File content:', content);
            appendContent(content, affectedLib);

            function read(filename) {
              try {
                const contentFile = fs.readFileSync(filename, 'utf8').replace('\n','');
                return contentFile;
              } catch (err) {
                core.error(err);
              }
            }

            function write(filename, content) {
              try {
                fs.writeFileSync(filename, content);
              } catch (err) {
                core.error(err);
              }
            }

            function appendContent(content, append) {
            console.log(`File contains ${content} append ${append}`)
              let changedContent;
              const libs = content.split(',');
              if (libs?.length>0) {
                if (libs.length === 1 && libs[0] === '') {
                  libs[0] = append;
                  changedContent = libs[0];
                }
                else if (!libs.includes(append)) {
                  libs.push(append);
                  changedContent = libs.join(',');
                } else {
                    console.log(`Lib ${append} already affected`);
                }
              }
              if (changedContent != undefined){
                console.log(`File content append: ${changedContent}`)
                write(fileName, changedContent);
              }
            }