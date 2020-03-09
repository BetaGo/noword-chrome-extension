import React from "react";
import { Word } from "../../api/word";
import { Message, MessageType } from "../../common/Message";

const TransContent: React.FC<{ text: string }> = ({ text }) => {
  const [loading, setLoading] = React.useState(true);
  const [word, setWord] = React.useState<Word | null>(null);
  React.useEffect(() => {
    new Promise<Word>(resolve => {
      chrome.runtime.sendMessage(
        new Message(MessageType.translateWord, text),
        function(response) {
          resolve(response);
        }
      );
    })
      .then(word => setWord(word))
      .then(() => setLoading(false));
  }, [text]);

  if (loading) return <div>Loading</div>;
  if (!word) return <div>翻译失败！</div>;
  return (
    <div>
      <div>{word.text}</div>
      <div>
        {word.phonetic.en && (
          <div>
            <span>EN:</span>
            <span>【{word.phonetic.en.text}】</span>
          </div>
        )}
        {word.phonetic.us && (
          <div>
            <span>US:</span>
            <span>【{word.phonetic.us.text}】</span>
          </div>
        )}
      </div>
      <div>
        {word.means.map(v => (
          <div>
            <span>{v.label}</span>
            <span>{v.content.join("；")}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransContent;
