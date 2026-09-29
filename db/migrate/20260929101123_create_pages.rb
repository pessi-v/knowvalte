class CreatePages < ActiveRecord::Migration[8.1]
  def change
    create_table :pages do |t|
      t.string :title, null: false
      t.string :slug, null: false
      t.json :content, null: false, default: {}
      t.integer :menu, null: false, default: 0
      t.integer :position, null: false, default: 0
      t.boolean :published, null: false, default: false
      t.string :meta_description

      t.timestamps
    end
    add_index :pages, :slug, unique: true
  end
end
