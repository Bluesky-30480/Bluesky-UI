import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { LandingPage } from './pages/Landing'
import { DocumentationPage } from './pages/Documentation'
import { ThemingPage } from './pages/Theming'
import {
  BoxPage,
  StackPage,
  CenterPage,
  TextPage,
  HeadingPage,
  DividerPage,
  GridPage,
  ScrollAreaPage,
  FocusTrapPage,
  TabsPage,
  AccordionPage,
  BreadcrumbPage,
  PaginationPage,
  StepperPage,
  NavMenuPage,
  SidebarPage,
  CommandPalettePage,
  CardPage,
  AvatarPage,
  AvatarGroupPage,
  TablePage,
  DataGridPage,
  VirtualListPage,
  TreePage,
  TimelinePage,
  CalendarPage,
  ChartsPage,
  ChatPage,
  AgentSystemPage,
  TaskManagerPage,
  ImagePage,
  ImageGalleryPage,
  VideoPlayerPage,
  AudioPlayerPage,
  AudioWaveformPage,
  FileUploadPage,
  FilePreviewPage,
  MusicPlayerPage,
  ReadingModulePage,
  MediaHelperPage,
  DevToolsPage,
  ExperimentalPage,
  ButtonPage,
  IconButtonPage,
  HoldToProceedButtonPage,
  ButtonGroupPage,
  ToggleButtonPage,
  LinkPage,
  InputPage,
  TextareaPage,
  CheckboxPage,
  SwitchPage,
  RadioPage,
  SelectPage,
  SliderPage,
  SpinnerPage,
  BadgePage,
  ProgressPage,
  AlertPage,
  SkeletonPage,
  TooltipPage,
  ToastPage,
  PopoverPage,
  DialogPage,
  ContextMenuPage,
  ModalPage,
  DrawerPage,
} from './pages/components'

export default function App() {
  return (
    <Routes>
      {/* Landing page - no layout */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Direct docs route (redirects to /home/docs) */}
      <Route path="/docs" element={<Layout />}>
        <Route index element={<DocumentationPage />} />
      </Route>
      
      {/* Direct theming route */}
      <Route path="/theming" element={<Layout />}>
        <Route index element={<ThemingPage />} />
      </Route>
      
      {/* Showcaser with layout */}
      <Route path="/home" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="docs" element={<DocumentationPage />} />
        <Route path="theming" element={<ThemingPage />} />
        
        {/* Component Pages - Primitives */}
        <Route path="components/box" element={<BoxPage />} />
        <Route path="components/stack" element={<StackPage />} />
        <Route path="components/center" element={<CenterPage />} />
        <Route path="components/text" element={<TextPage />} />
        <Route path="components/heading" element={<HeadingPage />} />
        <Route path="components/divider" element={<DividerPage />} />
        <Route path="components/grid" element={<GridPage />} />
        <Route path="components/scroll-area" element={<ScrollAreaPage />} />
        <Route path="components/focus-trap" element={<FocusTrapPage />} />
        <Route path="components/tabs" element={<TabsPage />} />
        <Route path="components/accordion" element={<AccordionPage />} />
        <Route path="components/breadcrumb" element={<BreadcrumbPage />} />
        <Route path="components/pagination" element={<PaginationPage />} />
        <Route path="components/stepper" element={<StepperPage />} />
        <Route path="components/nav-menu" element={<NavMenuPage />} />
        <Route path="components/sidebar" element={<SidebarPage />} />
        <Route path="components/command-palette" element={<CommandPalettePage />} />
        <Route path="components/card" element={<CardPage />} />
        <Route path="components/avatar" element={<AvatarPage />} />
        <Route path="components/avatar-group" element={<AvatarGroupPage />} />
        <Route path="components/table" element={<TablePage />} />
        <Route path="components/data-grid" element={<DataGridPage />} />
        <Route path="components/virtual-list" element={<VirtualListPage />} />
        <Route path="components/tree" element={<TreePage />} />
        <Route path="components/timeline" element={<TimelinePage />} />
        <Route path="components/calendar" element={<CalendarPage />} />
        <Route path="components/charts" element={<ChartsPage />} />
        <Route path="components/chat" element={<ChatPage />} />
        <Route path="components/agent-system" element={<AgentSystemPage />} />
        <Route path="components/task-manager" element={<TaskManagerPage />} />
        <Route path="components/image" element={<ImagePage />} />
        <Route path="components/image-gallery" element={<ImageGalleryPage />} />
        <Route path="components/video-player" element={<VideoPlayerPage />} />
        <Route path="components/audio-player" element={<AudioPlayerPage />} />
        <Route path="components/audio-waveform" element={<AudioWaveformPage />} />
        <Route path="components/file-upload" element={<FileUploadPage />} />
        <Route path="components/file-preview" element={<FilePreviewPage />} />
        <Route path="components/music-player" element={<MusicPlayerPage />} />
        <Route path="components/reading-module" element={<ReadingModulePage />} />
        <Route path="components/media-helper" element={<MediaHelperPage />} />
        <Route path="components/dev-tools" element={<DevToolsPage />} />
        <Route path="components/experimental" element={<ExperimentalPage />} />
        
        {/* Component Pages - Buttons */}
        <Route path="components/button" element={<ButtonPage />} />
        <Route path="components/icon-button" element={<IconButtonPage />} />
        <Route path="components/hold-to-proceed" element={<HoldToProceedButtonPage />} />
        <Route path="components/button-group" element={<ButtonGroupPage />} />
        <Route path="components/toggle-button" element={<ToggleButtonPage />} />
        <Route path="components/link" element={<LinkPage />} />
        
        {/* Component Pages - Inputs */}
        <Route path="components/input" element={<InputPage />} />
        <Route path="components/textarea" element={<TextareaPage />} />
        <Route path="components/checkbox" element={<CheckboxPage />} />
        <Route path="components/switch" element={<SwitchPage />} />
        <Route path="components/radio" element={<RadioPage />} />
        <Route path="components/select" element={<SelectPage />} />
        <Route path="components/slider" element={<SliderPage />} />
        
        {/* Component Pages - Feedback */}
        <Route path="components/spinner" element={<SpinnerPage />} />
        <Route path="components/badge" element={<BadgePage />} />
        <Route path="components/progress" element={<ProgressPage />} />
        <Route path="components/alert" element={<AlertPage />} />
        <Route path="components/skeleton" element={<SkeletonPage />} />
        <Route path="components/tooltip" element={<TooltipPage />} />
        <Route path="components/toast" element={<ToastPage />} />
        <Route path="components/popover" element={<PopoverPage />} />
        <Route path="components/dialog" element={<DialogPage />} />
        <Route path="components/context-menu" element={<ContextMenuPage />} />
        <Route path="components/modal" element={<ModalPage />} />
        <Route path="components/drawer" element={<DrawerPage />} />
      </Route>
    </Routes>
  )
}
