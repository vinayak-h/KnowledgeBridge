import EditorHeader from '../components/editor/EditorHeader.jsx';
import DetailsSection from '../components/editor/DetailsSection.jsx';
import WorkKnowledgeSection from '../components/editor/WorkKnowledgeSection.jsx';
import EditorSidebar from '../components/editor/EditorSidebar.jsx';

export default function EditorPage({ editor, onBack }) {
  return (
    <>
      <EditorHeader
        id={editor.id}
        saving={editor.saving}
        onBack={onBack}
        onSave={editor.save}
      />
      <div className="editor-layout">
        <div className="editor-main">
          <DetailsSection form={editor.form} patch={editor.patch} />
          <WorkKnowledgeSection editor={editor} />
        </div>
        <EditorSidebar editor={editor} />
      </div>
    </>
  );
}
