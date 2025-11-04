export default function TeamAvatar({ team, src, alt = 'avatar', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const teamColors = {
    '두산': { primary: '#131230', secondary: '#EA0029' },
    'LG': { primary: '#C30452', secondary: '#000000' },
    'KT': { primary: '#000000', secondary: '#E31937' },
    'SSG': { primary: '#CE0E2D', secondary: '#F37321' },
    'NC': { primary: '#1C4A9E', secondary: '#B0B0B0' },
    'KIA': { primary: '#EA0029', secondary: '#000000' },
    '롯데': { primary: '#041E42', secondary: '#D00F31' },
    '삼성': { primary: '#074CA1', secondary: '#000000' },
    '한화': { primary: '#FF6600', secondary: '#000000' },
    '키움': { primary: '#570514', secondary: '#000000' }
  };

  const getTeamInitial = (teamName) => {
    const initials = {
      '두산': '두',
      'LG': 'LG',
      'KT': 'KT',
      'SSG': 'S',
      'NC': 'NC',
      'KIA': 'K',
      '롯데': '롯',
      '삼성': '삼',
      '한화': '한',
      '키움': '키'
    };
    return initials[teamName] || teamName?.[0] || '?';
  };

  const colors = (team && teamColors[team]) ? teamColors[team] : { primary: '#6B7280', secondary: '#9CA3AF' };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  // 기본 이미지: 구단 색상과 이니셜
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.primary || '#6B7280'} 0%, ${colors.secondary || '#9CA3AF'} 100%)`
      }}
    >
      <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-3xl'}>
        {getTeamInitial(team)}
      </span>
    </div>
  );
}
