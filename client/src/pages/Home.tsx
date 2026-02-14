import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background with generated image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://private-us-east-1.manuscdn.com/sessionFile/pdCmvbGvjSFxrIixRRIHDC/sandbox/Qt50RxfOJXJX3SzH9LIWu4-img-1_1770999538000_na1fn_aGVyby1iYWNrZ3JvdW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcGRDbXZiR3ZqU0Z4cklpeFJSSUhEQy9zYW5kYm94L1F0NTBSeGZPSlhKWDNTekg5TElXdTQtaW1nLTFfMTc3MDk5OTUzODAwMF9uYTFmbl9hR1Z5YnkxaVlXTnJaM0p2ZFc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=arQ-3DTcT31j4hmSki1d8~ghP7k~7JJ2d3kJeUmMxI~Esz-4HId~T4BhI7-WPqZw5pdgS4wyFfd0SB9pJY0NXbHi02XhJ99tgCZLVwDhPLuRvBJb8X7riM4vq8XP2a0MArxHarhxbrnZqjeSz4nG7Q7jCm77ZUlDPZZEvTgx4oTaAX13dfl6D7mmPLFf-VfvRf3E8NgbH38jRobtIqUvqOVDalZsBgl9zecCvC9UPROjWuoC1pg3h0T~e2jwWH4Fj-tY2OfX4sI3sOQv1ZrBT~eMETPzPWCNlFCRrCvDlOMciKb~DC-~DadhJXeTYotVz2LMvPHywe1swD6AfQp~Sg__)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-2xl">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="https://private-us-east-1.manuscdn.com/sessionFile/pdCmvbGvjSFxrIixRRIHDC/sandbox/Qt50RxfOJXJX3SzH9LIWu4_1770999539223_na1fn_bG9nby1pY29u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcGRDbXZiR3ZqU0Z4cklpeFJSSUhEQy9zYW5kYm94L1F0NTBSeGZPSlhKWDNTekg5TElXdTRfMTc3MDk5OTUzOTIyM19uYTFmbl9iRzluYnkxcFkyOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qkVIwAPwLzobw~l5iN1FHCoAMxZeAN9r4v4LdvM5s-W6ynh6cJNGKrQkTTadRG0UVuVgQHZf3gi2Nq4W5KpiJupLYEZ8TO7x89j0k7oUyXIKpwx-pTw8p6ot0qGBr6ZEQ20Drpf382pl9Ma~aiUaIgOeowW1uGMzE9rX23mgEz5L~arTJCe8Q79IfE95o2Qd20KbYT7TFkQ6a9lt3vvswCeIPdW9Tt-q0sDPJNwF3LV8zOYuWAVJ5j1hIJDOcpmZUDIEUJ0Q2sLkciFd1nKUCPdm6vybdb88PAqnDaUc5cYD5VNN5EZNHAt0BRgaxjzRzB5MTyz9atVsHYyrrf2-iQ__"
            alt="Лента"
            className="w-32 h-32 mx-auto drop-shadow-2xl"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
          Лента
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-purple-200 mb-6 font-light">
          by: GTsoulcrime and Aloe
        </p>
        
        {/* Description */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500/30">
          <p className="text-lg text-gray-200 leading-relaxed">
            Лента это свободное место для сливов, мемчиков, и прочей разной информации. 
            Всё анонимно это свободное место
          </p>
        </div>
        
        {/* Enter Button */}
        <Button 
          size="lg"
          className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/50 transition-all hover:shadow-xl hover:shadow-primary/60"
          onClick={() => setLocation('/feed')}
        >
          Войти в ленту
        </Button>
      </div>
    </div>
  );
}
