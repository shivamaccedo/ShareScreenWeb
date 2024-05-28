export function prioritizeCodec(sdp, codec) {
    const lines = sdp.split('\r\n');
    let mLineIndex = -1;
    let codecRtpMap = null;
  
    // Find the codec RTP map
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('m=video')) {
        mLineIndex = i;
      }
      if (lines[i].includes(codec)) {
        const codecMatch = lines[i].match(/a=rtpmap:(\d+) /);
        if (codecMatch) {
          codecRtpMap = codecMatch[1];
          break;
        }
      }
    }
  
    if (mLineIndex === -1 || !codecRtpMap) {
      return sdp;
    }
  
    // Reorder the codecs in the m=video line
    const mLineParts = lines[mLineIndex].split(' ');
    const firstPart = mLineParts.slice(0, 3); // e.g., m=video 9 UDP/TLS/RTP/SAVPF
    const codecPayloadTypes = mLineParts.slice(3).filter(pt => pt !== codecRtpMap);
    codecPayloadTypes.unshift(codecRtpMap);
    lines[mLineIndex] = [...firstPart, ...codecPayloadTypes].join(' ');
  
    return lines.join('\r\n');
  }